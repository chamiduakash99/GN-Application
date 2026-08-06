package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CertificaterequestDao;
import lk.earth.earthuniversity.dao.CertificatetypeDao;
import lk.earth.earthuniversity.dao.RequeststatusDao;
import lk.earth.earthuniversity.entity.Certificaterequest;
import lk.earth.earthuniversity.entity.Requeststatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/certificaterequests")
public class CertificaterequestController {

    @Autowired
    private CertificaterequestDao certificaterequestdao;

    @Autowired
    private CertificatetypeDao certificatetypedao;

    @Autowired
    private RequeststatusDao requeststatusdao;

    // ──────────────────────────────────────────────────────────────
    // GET  /certificaterequests[?citizenid=X&requeststatusid=Y&...]
    // ──────────────────────────────────────────────────────────────
    @GetMapping(produces = "application/json")
    public List<Certificaterequest> get(@RequestParam HashMap<String, String> params) {

        List<Certificaterequest> certificaterequests = certificaterequestdao.findAll();
        if (params.isEmpty()) return certificaterequests;

        Stream<Certificaterequest> stream = certificaterequests.stream();

        String citizenid = params.get("citizenid");
        if (citizenid != null)
            stream = stream.filter(r -> r.getCitizen() != null &&
                    r.getCitizen().getId() == Integer.parseInt(citizenid));

        String requeststatusid = params.get("requeststatusid");
        if (requeststatusid != null)
            stream = stream.filter(r -> r.getRequeststatus() != null &&
                    r.getRequeststatus().getId() == Integer.parseInt(requeststatusid));

        String certificatetypeid = params.get("certificatetypeid");
        if (certificatetypeid != null)
            stream = stream.filter(r -> r.getCertificatetype() != null &&
                    r.getCertificatetype().getId() == Integer.parseInt(certificatetypeid));

        return stream.collect(Collectors.toList());
    }

    // ──────────────────────────────────────────────────────────────
    // POST  /certificaterequests
    // ──────────────────────────────────────────────────────────────
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Certificaterequest certificaterequest) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (certificaterequest.getCitizen() == null) {
            errors += "Citizen is required<br>";
        }
        if (certificaterequest.getCertificatetype() == null) {
            errors += "Certificate Type is required<br>";
        }

        if (errors.isEmpty()) {
            // New requests always start as Pending (id = 1)
            Requeststatus pending = new Requeststatus();
            pending.setId(1);
            certificaterequest.setRequeststatus(pending);
            certificaterequest.setRequesteddate(new Date(System.currentTimeMillis()));
            certificaterequest.setUpdateddate(new Date(System.currentTimeMillis()));
            certificaterequestdao.save(certificaterequest);
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(certificaterequest.getId()));
        response.put("url", "/certificaterequests/" + certificaterequest.getId());
        response.put("errors", errors);
        return response;
    }

    // ──────────────────────────────────────────────────────────────
    // PUT  /certificaterequests/{id}
    // ──────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> update(@PathVariable Integer id,
                                          @RequestBody Certificaterequest certificaterequest) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Certificaterequest existing = certificaterequestdao.findByMyId(id);
        if (existing == null) {
            errors = "Certificate Request Does Not Exist";
        }

        if (errors.isEmpty()) {
            certificaterequest.setId(id);
            certificaterequest.setUpdateddate(new Date(System.currentTimeMillis()));
            certificaterequestdao.save(certificaterequest);
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/certificaterequests/" + id);
        response.put("errors", errors);
        return response;
    }

    // ──────────────────────────────────────────────────────────────
    // PUT  /certificaterequests/{id}/approve
    // Changes status → Approved (id = 2)
    // ──────────────────────────────────────────────────────────────
    @PutMapping("/{id}/approve")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> approve(@PathVariable Integer id) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Certificaterequest request = certificaterequestdao.findByMyId(id);
        if (request == null) {
            errors = "Certificate Request Does Not Exist";
        } else if (request.getRequeststatus() == null ||
                request.getRequeststatus().getId() != 1) {
            errors = "Only Pending requests can be approved";
        }

        if (errors.isEmpty()) {
            Requeststatus approved = new Requeststatus();
            approved.setId(2); // Approved
            request.setRequeststatus(approved);
            request.setUpdateddate(new Date(System.currentTimeMillis()));
            certificaterequestdao.save(request);
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/certificaterequests/" + id);
        response.put("errors", errors);
        return response;
    }

    // ──────────────────────────────────────────────────────────────
    // PUT  /certificaterequests/{id}/reject?rejectReason=...
    // Changes status → Rejected (id = 3)
    // ──────────────────────────────────────────────────────────────
    @PutMapping("/{id}/reject")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> reject(@PathVariable Integer id,
                                          @RequestParam String rejectReason) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Certificaterequest request = certificaterequestdao.findByMyId(id);
        if (request == null) {
            errors = "Certificate Request Does Not Exist";
        } else if (request.getRequeststatus() == null ||
                request.getRequeststatus().getId() != 1) {
            errors = "Only Pending requests can be rejected";
        }

        if (errors.isEmpty()) {
            Requeststatus rejected = new Requeststatus();
            rejected.setId(3); // Rejected
            request.setRequeststatus(rejected);
            request.setRejectreason(rejectReason);
            request.setUpdateddate(new Date(System.currentTimeMillis()));
            certificaterequestdao.save(request);
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/certificaterequests/" + id);
        response.put("errors", errors);
        return response;
    }

    // ──────────────────────────────────────────────────────────────
    // PUT  /certificaterequests/{id}/complete
    // Changes status → Completed (id = 5) — called after citizen downloads PDF
    // ──────────────────────────────────────────────────────────────
    @PutMapping("/{id}/complete")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> complete(@PathVariable Integer id) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Certificaterequest request = certificaterequestdao.findByMyId(id);
        if (request == null) {
            errors = "Certificate Request Does Not Exist";
        } else if (request.getRequeststatus() == null ||
                request.getRequeststatus().getId() != 4) {
            errors = "Only Certificate Ready requests can be marked as Completed";
        }

        if (errors.isEmpty()) {
            Requeststatus completed = new Requeststatus();
            completed.setId(5); // Completed
            request.setRequeststatus(completed);
            request.setUpdateddate(new Date(System.currentTimeMillis()));
            certificaterequestdao.save(request);
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/certificaterequests/" + id);
        response.put("errors", errors);
        return response;
    }

    // ──────────────────────────────────────────────────────────────
    // DELETE  /certificaterequests/{id}
    // ──────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Certificaterequest existing = certificaterequestdao.findByMyId(id);
        if (existing == null) {
            errors = "Certificate Request Does Not Exist";
        }

        if (errors.isEmpty()) {
            certificaterequestdao.deleteById(id);
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/certificaterequests/" + id);
        response.put("errors", errors);
        return response;
    }

    // ──────────────────────────────────────────────────────────────
    // GET  /certificaterequests/statussummary
    // ──────────────────────────────────────────────────────────────
    @GetMapping("/statussummary")
    public List<Object[]> getStatusSummary() {
        return certificaterequestdao.getStatusSummary();
    }
}

//package lk.earth.earthuniversity.controller;
//
//import lk.earth.earthuniversity.dao.CertificaterequestDao;
//import lk.earth.earthuniversity.entity.Certificaterequest;
//
//import lk.earth.earthuniversity.entity.Requeststatus;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.stream.Collectors;
//import java.util.stream.Stream;
//
//@CrossOrigin
//@RestController
//@RequestMapping("/certificaterequests")
////@RequestMapping(value = "/certificaterequests")
//public class CertificaterequestController {
//
//    @Autowired
//    private CertificaterequestDao certificaterequestdao;
//
//
//    @GetMapping(produces = "application/json")
//    public List<Certificaterequest> get(@RequestParam HashMap<String,String> params){
//
//        List<Certificaterequest> requests =
//                certificaterequestdao.findAll();
//
//        if(params.isEmpty()) return requests;
//
//        String purpose = params.get("purpose");
//        String citizenid = params.get("citizenid");
//        String requeststatusid = params.get("requeststatusid");
//        String certificatetypeid = params.get("certificatetypeid");
//
//        Stream<Certificaterequest> rstream = requests.stream();
//
//        if(purpose != null)
//            rstream = rstream.filter(r ->
//                    r.getPurpose().contains(purpose));
//
//        if(citizenid != null)
//            rstream = rstream.filter(r ->
//                    r.getCitizen().getId() ==
//                            Integer.parseInt(citizenid));
//
//        if(requeststatusid != null)
//            rstream = rstream.filter(r ->
//                    r.getRequeststatus().getId() ==
//                            Integer.parseInt(requeststatusid));
//
//        if(certificatetypeid != null)
//            rstream = rstream.filter(r ->
//                    r.getCertificatetype().getId() ==
//                            Integer.parseInt(certificatetypeid));
//
//        return rstream.collect(Collectors.toList());
//
//    }
//
//
//    @GetMapping(path = "/list", produces = "application/json")
//    public List<Certificaterequest> getList(){
//
//        List<Certificaterequest> requests =
//                certificaterequestdao.findAllNameId();
//
//        requests = requests.stream().map(
//                request -> {
//                    Certificaterequest cr =
//                            new Certificaterequest(
//                                    request.getId(),
//                                    request.getPurpose()
//                            );
//
//                    return cr;
//                }
//        ).collect(Collectors.toList());
//
//        return requests;
//
//    }
//
//
//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String,String> add(
//            @RequestBody Certificaterequest certificaterequest){
//
//        HashMap<String,String> response = new HashMap<>();
//
//        String errors = "";
//
//        if(errors.equals("")) {
//            // Auto set requested date
//            certificaterequest.setRequesteddate(
//                    new java.sql.Date(System.currentTimeMillis()));
//
//            // Auto set updated date
//            certificaterequest.setUpdateddate(
//                    new java.sql.Date(System.currentTimeMillis()));
//
//            // Auto set default status to Pending (id=1)
//            Requeststatus pending = new Requeststatus();
//            pending.setId(1);
//            certificaterequest.setRequeststatus(pending);
//
//            certificaterequestdao.save(certificaterequest);
//        } else {
//            errors = "Server Validation Errors : <br> " + errors;
//        }
//        return response;
//    }
//
////    @PostMapping
////    @ResponseStatus(HttpStatus.CREATED)
////    public HashMap<String,String> add(
////            @RequestBody Certificaterequest certificaterequest){
////
////        HashMap<String,String> response = new HashMap<>();
////
////        String errors = "";
////
////        if(errors.equals(""))
////            certificaterequestdao.save(certificaterequest);
////        else
////            errors = "Server Validation Errors : <br> " + errors;
////
////        response.put("id",
////                String.valueOf(certificaterequest.getId()));
////
////        response.put("url",
////                "/certificaterequests/" +
////                        certificaterequest.getId());
////
////        response.put("errors", errors);
////
////        return response;
////
////    }
//
//
//    @PutMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String,String> update(
//            @RequestBody Certificaterequest certificaterequest){
//
//        HashMap<String,String> response = new HashMap<>();
//
//        String errors = "";
//
//        if(errors.equals(""))
//            certificaterequestdao.save(certificaterequest);
//        else
//            errors = "Server Validation Errors : <br> " + errors;
//
//        response.put("id",
//                String.valueOf(certificaterequest.getId()));
//
//        response.put("url",
//                "/certificaterequests/" +
//                        certificaterequest.getId());
//
//        response.put("errors", errors);
//
//        return response;
//
//    }
//
//
//    @DeleteMapping("/{id}")
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String,String> delete(
//            @PathVariable Integer id){
//
//        HashMap<String,String> response = new HashMap<>();
//
//        String errors = "";
//
//        Certificaterequest request =
//                certificaterequestdao.findByMyId(id);
//
//        if(request == null)
//            errors = errors +
//                    "<br> Certificate Request Does Not Exist";
//
//        if(errors.equals(""))
//            certificaterequestdao.delete(request);
//        else
//            errors = "Server Validation Errors : <br> " + errors;
//
//        response.put("id", String.valueOf(id));
//
//        response.put("url",
//                "/certificaterequests/" + id);
//
//        response.put("errors", errors);
//
//        return response;
//
//    }
//
//    @GetMapping(value = "/status-summary", produces = "application/json")
//    public List<HashMap<String, Object>> getStatusSummary() {
//
//        List<Object[]> result = certificaterequestdao.getStatusSummary();
//
//        List<HashMap<String, Object>> summary = new ArrayList<>();
//
//        for (Object[] row : result) {
//            HashMap<String, Object> map = new HashMap<>();
//            map.put("status", row[0]);
//            map.put("count", row[1]);
//            summary.add(map);
//        }
//
//        return summary;
//    }
//
//}