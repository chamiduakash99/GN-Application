package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.ComplaintDao;
import lk.earth.earthuniversity.entity.Complaint;
import lk.earth.earthuniversity.entity.Complaintstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

        String citizenid       = params.get("citizenid");
        String employeeid      = params.get("employeeid");
        String complaintstatusid = params.get("complaintstatusid");
        String subject         = params.get("subject");

        Stream<Complaint> stream = complaints.stream();

        if (citizenid != null)
            stream = stream.filter(c -> c.getCitizen().getId() == Integer.parseInt(citizenid));
        if (employeeid != null)
            stream = stream.filter(c -> c.getEmployee().getId() == Integer.parseInt(employeeid));
        if (complaintstatusid != null)
            stream = stream.filter(c -> c.getComplaintstatus().getId() == Integer.parseInt(complaintstatusid));
        if (subject != null)
            stream = stream.filter(c -> c.getSubject().toLowerCase().contains(subject.toLowerCase()));

        return stream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Complaint complaint) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals("")) {
            // Auto-set complained date
            complaint.setComplaineddate(new java.sql.Timestamp(System.currentTimeMillis()));

            // Auto-set default status to Pending (id=1)
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
    public HashMap<String, String> update(@RequestBody Complaint complaint) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals(""))
            complaintdao.save(complaint);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id", String.valueOf(complaint.getId()));
        response.put("url", "/complaints/" + complaint.getId());
        response.put("errors", errors);
        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Complaint complaint = complaintdao.findById(id).orElse(null);

        if (complaint == null)
            errors = errors + "<br> Complaint Does Not Exist";

        if (errors.equals(""))
            complaintdao.delete(complaint);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id", String.valueOf(id));
        response.put("url", "/complaints/" + id);
        response.put("errors", errors);
        return response;
    }
}