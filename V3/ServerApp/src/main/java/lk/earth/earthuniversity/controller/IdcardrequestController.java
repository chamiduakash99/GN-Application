package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.IdcardrequestDao;
import lk.earth.earthuniversity.entity.Idcardrequest;
import lk.earth.earthuniversity.entity.Idcardrequeststatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/idcardrequests")
public class IdcardrequestController {

    @Autowired
    private IdcardrequestDao idcardrequestdao;

    @GetMapping(produces = "application/json")
    public List<Idcardrequest> get(@RequestParam HashMap<String, String> params) {
        List<Idcardrequest> requests = idcardrequestdao.findAll();
        if (params.isEmpty()) return requests;

        String citizenid            = params.get("citizenid");
        String employeeid           = params.get("employeeid");
        String idcardrequeststatusid = params.get("idcardrequeststatusid");
        String reasonid             = params.get("reasonid");

        Stream<Idcardrequest> stream = requests.stream();

        if (citizenid != null)
            stream = stream.filter(r -> r.getCitizen().getId() == Integer.parseInt(citizenid));
        if (employeeid != null)
            stream = stream.filter(r -> r.getEmployee().getId() == Integer.parseInt(employeeid));
        if (idcardrequeststatusid != null)
            stream = stream.filter(r -> r.getIdcardrequeststatus().getId() == Integer.parseInt(idcardrequeststatusid));
        if (reasonid != null)
            stream = stream.filter(r -> r.getReason().getId() == Integer.parseInt(reasonid));

        return stream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Idcardrequest idcardrequest) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals("")) {
            // Auto-set applied date
            idcardrequest.setApplieddate(new java.sql.Timestamp(System.currentTimeMillis()));

            // Auto-set default status to Pending (id=1)
            Idcardrequeststatus pending = new Idcardrequeststatus();
            pending.setId(1);
            idcardrequest.setIdcardrequeststatus(pending);

            idcardrequestdao.save(idcardrequest);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("errors", errors);
        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Idcardrequest idcardrequest) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals(""))
            idcardrequestdao.save(idcardrequest);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id", String.valueOf(idcardrequest.getId()));
        response.put("url", "/idcardrequests/" + idcardrequest.getId());
        response.put("errors", errors);
        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Idcardrequest request = idcardrequestdao.findById(id).orElse(null);

        if (request == null)
            errors = errors + "<br> ID Card Request Does Not Exist";

        if (errors.equals(""))
            idcardrequestdao.delete(request);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id", String.valueOf(id));
        response.put("url", "/idcardrequests/" + id);
        response.put("errors", errors);
        return response;
    }
}