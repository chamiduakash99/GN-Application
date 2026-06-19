package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.ComplaintDao;
import lk.earth.earthuniversity.entity.Complaint;
import lk.earth.earthuniversity.entity.Complaintstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintDao complaintdao;

    @GetMapping(produces = "application/json")
    public List<Complaint> get(@RequestParam HashMap<String, String> params) {

        List<Complaint> complaints = complaintdao.findAll();

        if (params.isEmpty()) return complaints;

        String subject = params.get("subject");
        String citizenid = params.get("citizenid");
        String complaintstatusid = params.get("complaintstatusid");

        Stream<Complaint> cstream = complaints.stream();

        if (subject != null)
            cstream = cstream.filter(c ->
                    c.getSubject().contains(subject));

        if (citizenid != null)
            cstream = cstream.filter(c ->
                    c.getCitizen().getId() ==
                            Integer.parseInt(citizenid));

        if (complaintstatusid != null)
            cstream = cstream.filter(c ->
                    c.getComplaintstatus().getId() ==
                            Integer.parseInt(complaintstatusid));

        return cstream.collect(Collectors.toList());
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Complaint> getList() {
        List<Complaint> complaints =
                complaintdao.findAllNameId();

        complaints = complaints.stream().map(
                complaint -> {
                    Complaint c =
                            new Complaint(
                                    complaint.getId(),
                                    complaint.getSubject()
                            );
                    return c;
                }
        ).collect(Collectors.toList());

        return complaints;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(
            @RequestBody Complaint complaint) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals("")) {
            // Auto set complained date
            complaint.setComplaineddate(
                    new java.sql.Timestamp(System.currentTimeMillis()));

            // Auto set default status to Pending (id=1)
            Complaintstatus pending = new Complaintstatus();
            pending.setId(1);
            complaint.setComplaintstatus(pending);

            complaintdao.save(complaint);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("errors", errors);
        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(
            @RequestBody Complaint complaint) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals(""))
            complaintdao.save(complaint);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",
                String.valueOf(complaint.getId()));

        response.put("url",
                "/complaints/" +
                        complaint.getId());

        response.put("errors", errors);
        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(
            @PathVariable Integer id) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Complaint complaint =
                complaintdao.findByMyId(id);

        if (complaint == null)
            errors = errors +
                    "<br> Complaint Does Not Exist";

        if (errors.equals(""))
            complaintdao.delete(complaint);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id", String.valueOf(id));
        response.put("url",
                "/complaints/" + id);
        response.put("errors", errors);
        return response;
    }

    // ── Approve: officer records action taken / referral ───────────────
    @PutMapping("/{id}/approve")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> approve(
            @PathVariable Integer id,
            @RequestParam String actiontaken,
            @RequestParam(required = false) String referredto,
            @RequestParam Integer employeeid) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Complaint complaint = complaintdao.findByMyId(id);

        if (complaint == null) {
            errors = "<br> Complaint Does Not Exist";
        } else if (!complaint.getComplaintstatus().getName().equals("Pending")) {
            errors = "<br> Only Pending complaints can be approved";
        }

        if (errors.equals("")) {
            Complaintstatus approved = new Complaintstatus();
            approved.setId(2); // Approved
            complaint.setComplaintstatus(approved);
            complaint.setActiontaken(actiontaken);
            complaint.setReferredto(referredto);

            lk.earth.earthuniversity.entity.Employee employee =
                    new lk.earth.earthuniversity.entity.Employee();
            employee.setId(employeeid);
            complaint.setEmployee(employee);

            complaintdao.save(complaint);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("errors", errors);
        return response;
    }

    // ── Reject: officer must give a reason ──────────────────────────────
    @PutMapping("/{id}/reject")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> reject(
            @PathVariable Integer id,
            @RequestParam String rejectreason,
            @RequestParam Integer employeeid) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Complaint complaint = complaintdao.findByMyId(id);

        if (complaint == null) {
            errors = "<br> Complaint Does Not Exist";
        } else if (!complaint.getComplaintstatus().getName().equals("Pending")) {
            errors = "<br> Only Pending complaints can be rejected";
        } else if (rejectreason == null || rejectreason.trim().equals("")) {
            errors = "<br> Reject Reason is required";
        }

        if (errors.equals("")) {
            Complaintstatus rejected = new Complaintstatus();
            rejected.setId(3); // Rejected
            complaint.setComplaintstatus(rejected);
            complaint.setRejectreason(rejectreason);

            lk.earth.earthuniversity.entity.Employee employee =
                    new lk.earth.earthuniversity.entity.Employee();
            employee.setId(employeeid);
            complaint.setEmployee(employee);

            complaintdao.save(complaint);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("errors", errors);
        return response;
    }

    // ── Update status: Approved -> Investigating / Resolved / Passed to Authorities ──
    // Allowed target status ids: 4 (Investigating), 5 (Resolved), 6 (Passed to Authorities)
    @PutMapping("/{id}/status")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> updateStatus(
            @PathVariable Integer id,
            @RequestParam Integer statusid,
            @RequestParam Integer employeeid) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Complaint complaint = complaintdao.findByMyId(id);

        if (complaint == null) {
            errors = "<br> Complaint Does Not Exist";
        } else if (complaint.getComplaintstatus().getId() == 1
                || complaint.getComplaintstatus().getId() == 3) {
            errors = "<br> Complaint must be Approved before changing this status";
        } else if (statusid != 4 && statusid != 5 && statusid != 6) {
            errors = "<br> Invalid Status";
        }

        if (errors.equals("")) {
            Complaintstatus newstatus = new Complaintstatus();
            newstatus.setId(statusid);
            complaint.setComplaintstatus(newstatus);

            lk.earth.earthuniversity.entity.Employee employee =
                    new lk.earth.earthuniversity.entity.Employee();
            employee.setId(employeeid);
            complaint.setEmployee(employee);

            complaintdao.save(complaint);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("errors", errors);
        return response;
    }

    @GetMapping(value = "/status-summary", produces = "application/json")
    public List<HashMap<String, Object>> getStatusSummary() {
        List<Object[]> result = complaintdao.getStatusSummary();
        List<HashMap<String, Object>> summary = new ArrayList<>();

        for (Object[] row : result) {
            HashMap<String, Object> map = new HashMap<>();
            map.put("status", row[0]);
            map.put("count", row[1]);
            summary.add(map);
        }

        return summary;
    }
}