package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.StreetstatusDao;
import lk.earth.earthuniversity.entity.Streetstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/streetstatus")
public class StreetstatusController {

    @Autowired
    private StreetstatusDao streetstatusDao;

    // GET all
    @GetMapping("/list")
    public List<Streetstatus> getAll() {
        return streetstatusDao.findAll();
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> save(@RequestBody Streetstatus status) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (status.getStatus() == null || status.getStatus().trim().isEmpty()) {
            errors += "Status cannot be empty.<br>";
        }

        if (errors.isEmpty()) {
            streetstatusDao.save(status);
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", String.valueOf(status.getId()));
        response.put("url", "/streetstatus/post");
        response.put("errors", errors);
        return response;
    }
    // GET by id
    @GetMapping("/{id}")
    public Optional<Streetstatus> getById(@PathVariable Integer id) {
        return streetstatusDao.findById(id);
    }

    // POST - create new


    // PUT - update
    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Streetstatus status) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Optional<Streetstatus> ext = streetstatusDao.findById(status.getId());
        if (ext.isEmpty()) {
            errors += "No record found with id " + status.getId();
        }

        if (errors.isEmpty()) {
            streetstatusDao.save(status);
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", String.valueOf(status.getId()));
        response.put("url", "/streetstatus/put");
        response.put("errors", errors);
        return response;
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (streetstatusDao.existsById(id)) {
            streetstatusDao.deleteById(id);
        } else {
            errors = "Server Validation Errors:<br>No record found";
        }

        response.put("url", "/streetstatus/delete");
        response.put("errors", errors);
        return response;
    }
}
