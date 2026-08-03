package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.TreecuttingrequestDao;
import lk.earth.earthuniversity.entity.Treecuttingrequest;
import lk.earth.earthuniversity.entity.Treepermissionstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@CrossOrigin
@RestController
@RequestMapping("/treecuttingrequests")
public class TreecuttingrequestController {

    @Autowired
    private TreecuttingrequestDao treecuttingrequestdao;

    // ── GET with optional filters ─────────────────────────────────────────────
    @GetMapping(produces = "application/json")
    public List<Treecuttingrequest> get(@RequestParam HashMap<String, String> params) {
        List<Treecuttingrequest> requests = treecuttingrequestdao.findAll();
        if (params.isEmpty()) return requests;

        String citizenid              = params.get("citizenid");
        String employeeid             = params.get("employeeid");
        String treepermissionstatusid = params.get("treepermissionstatusid");
        String treetypeid             = params.get("treetypeid");
        String needstransport         = params.get("needstransport");

        Stream<Treecuttingrequest> stream = requests.stream();

        if (citizenid != null)
            stream = stream.filter(r -> r.getCitizen().getId() == Integer.parseInt(citizenid));
        if (employeeid != null)
            stream = stream.filter(r -> r.getEmployee().getId() == Integer.parseInt(employeeid));
        if (treepermissionstatusid != null)
            stream = stream.filter(r -> r.getTreepermissionstatus().getId() == Integer.parseInt(treepermissionstatusid));
        if (treetypeid != null)
            stream = stream.filter(r -> r.getTreetype().getId() == Integer.parseInt(treetypeid));
        if (needstransport != null)
            stream = stream.filter(r -> r.getNeedstransport() != null &&
                    r.getNeedstransport().equals(Boolean.parseBoolean(needstransport)));

        return stream.collect(Collectors.toList());
    }

    // ── POST — citizen submits new request ────────────────────────────────────
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Treecuttingrequest treecuttingrequest) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (treecuttingrequest.getTreecount() == null || treecuttingrequest.getTreecount() <= 0) {
            errors += "<br> Number of trees must be at least 1";
        }

        if (treecuttingrequest.getNeedstransport() != null && treecuttingrequest.getNeedstransport()) {
            if (treecuttingrequest.getTransportdate() == null || treecuttingrequest.getTransportdate().isEmpty()) {
                errors += "<br> Transport date is required";
            } else if (isPastDate(treecuttingrequest.getTransportdate())) {
                errors += "<br> Transport date cannot be in the past";
            }
        }

        if (errors.equals("")) {
            treecuttingrequest.setRequesteddate(
                    new java.sql.Timestamp(System.currentTimeMillis()));

            Treepermissionstatus pending = new Treepermissionstatus();
            pending.setId(1);
            treecuttingrequest.setTreepermissionstatus(pending);

            if (treecuttingrequest.getNeedstransport() == null ||
                    !treecuttingrequest.getNeedstransport()) {
                treecuttingrequest.setDestination(null);
                treecuttingrequest.setVehicletype(null);
                treecuttingrequest.setVehiclenumber(null);
                treecuttingrequest.setTransportdate(null);
            }

            treecuttingrequestdao.save(treecuttingrequest);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id",  String.valueOf(treecuttingrequest.getId()));
        response.put("url", "/treecuttingrequests/" + treecuttingrequest.getId());
        response.put("errors", errors);
        return response;
    }

    // ── PUT — citizen updates their own Pending request ────────────────────────
    @PutMapping("/{id}/citizenupdate")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> citizenUpdate(@PathVariable Integer id,
                                                 @RequestBody Treecuttingrequest incoming) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Treecuttingrequest existing = treecuttingrequestdao.findById(id).orElse(null);

        if (existing == null) {
            errors = "<br> Tree Cutting Request Does Not Exist";
        } else if (!"Pending".equals(existing.getTreepermissionstatus().getName())) {
            errors = "<br> Only Pending requests can be updated";
        } else if (incoming.getTreecount() == null || incoming.getTreecount() <= 0) {
            errors = "<br> Number of trees must be at least 1";
        } else if (Boolean.TRUE.equals(incoming.getNeedstransport())) {
            if (incoming.getTransportdate() == null || incoming.getTransportdate().isEmpty()) {
                errors = "<br> Transport date is required";
            } else if (isPastDate(incoming.getTransportdate())) {
                errors = "<br> Transport date cannot be in the past";
            }
        }

        if (errors.equals("")) {
            existing.setTreetype(incoming.getTreetype());
            existing.setDeedno(incoming.getDeedno());
            existing.setTreecount(incoming.getTreecount());
            existing.setReasonforcutting(incoming.getReasonforcutting());
            existing.setNeedstransport(incoming.getNeedstransport());

            if (Boolean.TRUE.equals(incoming.getNeedstransport())) {
                existing.setDestination(incoming.getDestination());
                existing.setVehicletype(incoming.getVehicletype());
                existing.setVehiclenumber(incoming.getVehiclenumber());
                existing.setTransportdate(incoming.getTransportdate());
            } else {
                existing.setDestination(null);
                existing.setVehicletype(null);
                existing.setVehiclenumber(null);
                existing.setTransportdate(null);
            }

            treecuttingrequestdao.save(existing);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/treecuttingrequests/" + id);
        response.put("errors", errors);
        return response;
    }

    // helper — transportdate is a String (e.g. "2026-08-05T00:00:00.000Z"), compare its date part
    private boolean isPastDate(String isoDateStr) {
        if (isoDateStr == null || isoDateStr.length() < 10) return false;
        String datePart = isoDateStr.substring(0, 10);
        String today = java.time.LocalDate.now().toString();
        return datePart.compareTo(today) < 0;
    }

    // ── PUT — GN officer updates (approve / reject / status change) ───────────
    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Treecuttingrequest treecuttingrequest) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals(""))
            treecuttingrequestdao.save(treecuttingrequest);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",  String.valueOf(treecuttingrequest.getId()));
        response.put("url", "/treecuttingrequests/" + treecuttingrequest.getId());
        response.put("errors", errors);
        return response;
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Treecuttingrequest request = treecuttingrequestdao.findById(id).orElse(null);

        if (request == null)
            errors = "<br> Tree Cutting Request Does Not Exist";

        if (errors.equals(""))
            treecuttingrequestdao.delete(request);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",  String.valueOf(id));
        response.put("url", "/treecuttingrequests/" + id);
        response.put("errors", errors);
        return response;
    }

    // ── PUT approve ───────────────────────────────────────────────────────────
    @PutMapping("/{id}/approve")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> approve(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Treecuttingrequest request = treecuttingrequestdao.findById(id).orElse(null);

        if (request == null) {
            errors = "<br> Tree Cutting Request Does Not Exist";
        } else {
            Treepermissionstatus approved = new Treepermissionstatus();
            approved.setId(2); // Approved
            request.setTreepermissionstatus(approved);
            treecuttingrequestdao.save(request);
        }

        response.put("errors", errors);
        return response;
    }

    // ── PUT reject ────────────────────────────────────────────────────────────
    @PutMapping("/{id}/reject")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> reject(@PathVariable Integer id,
                                          @RequestParam String rejectReason) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Treecuttingrequest request = treecuttingrequestdao.findById(id).orElse(null);

        if (request == null) {
            errors = "<br> Tree Cutting Request Does Not Exist";
        } else {
            Treepermissionstatus rejected = new Treepermissionstatus();
            rejected.setId(3); // Rejected
            request.setTreepermissionstatus(rejected);
            request.setRejectreason(rejectReason);
            treecuttingrequestdao.save(request);
        }

        response.put("errors", errors);
        return response;
    }

    // ── PUT upload permit PDF ─────────────────────────────────────────────────
    @PutMapping("/{id}/uploadpermit")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> uploadPermit(@PathVariable Integer id,
                                                @RequestBody byte[] pdfBytes) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Treecuttingrequest request = treecuttingrequestdao.findById(id).orElse(null);

        if (request == null) {
            errors = "<br> Tree Cutting Request Does Not Exist";
        } else {
            request.setPermitpdf(pdfBytes);

            // Auto-advance status to Permit Issued (id=4)
            Treepermissionstatus issued = new Treepermissionstatus();
            issued.setId(4);
            request.setTreepermissionstatus(issued);

            treecuttingrequestdao.save(request);
        }

        response.put("errors", errors);
        return response;
    }

    // ── PUT upload transport PDF ──────────────────────────────────────────────
    @PutMapping("/{id}/uploadtransport")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> uploadTransport(@PathVariable Integer id,
                                                   @RequestBody byte[] pdfBytes) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Treecuttingrequest request = treecuttingrequestdao.findById(id).orElse(null);

        if (request == null) {
            errors = "<br> Tree Cutting Request Does Not Exist";
        } else if (request.getNeedstransport() == null || !request.getNeedstransport()) {
            errors = "<br> This request does not require a transport permit";
        } else {
            request.setTransportpdf(pdfBytes);
            treecuttingrequestdao.save(request);
        }

        response.put("errors", errors);
        return response;
    }

    // ── GET permit PDF — citizen downloads once Permit Issued ──────────────────
    @GetMapping("/{id}/permitpdf")
    public ResponseEntity<byte[]> getPermitPdf(@PathVariable Integer id) {
        Treecuttingrequest request = treecuttingrequestdao.findById(id).orElse(null);
        if (request == null || request.getPermitpdf() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"permit_" + id + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(request.getPermitpdf());
    }

    // ── GET transport PDF — citizen downloads if transport was requested ───────
    @GetMapping("/{id}/transportpdf")
    public ResponseEntity<byte[]> getTransportPdf(@PathVariable Integer id) {
        Treecuttingrequest request = treecuttingrequestdao.findById(id).orElse(null);
        if (request == null || request.getTransportpdf() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"transport_permit_" + id + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(request.getTransportpdf());
    }

    @GetMapping("/statussummary")
    public List<Object[]> getStatusSummary() {
        return treecuttingrequestdao.getStatusSummary();
    }
}