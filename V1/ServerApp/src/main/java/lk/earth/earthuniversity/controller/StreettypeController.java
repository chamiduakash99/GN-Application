package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.StreettypeDao;
import lk.earth.earthuniversity.entity.Streettype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/streettype")
public class StreettypeController {

    @Autowired
    private StreettypeDao streettypeDao;

    @GetMapping("/list")
    public List<Streettype> getAll() {
        return streettypeDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Streettype> getById(@PathVariable Integer id) {
        return streettypeDao.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> save(@RequestBody Streettype type) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (type.getName() == null || type.getName().trim().isEmpty()) {
            errors += "Name cannot be empty.<br>";
        }

        if (errors.isEmpty()) {
            streettypeDao.save(type);
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", String.valueOf(type.getId()));
        response.put("url", "/streettype/post");
        response.put("errors", errors);
        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Streettype type) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Optional<Streettype> ext = streettypeDao.findById(type.getId());
        if (ext.isPresent()) {
        } else {
            errors += "No record found with id " + type.getId();
        }

        if (errors.isEmpty()) {
            streettypeDao.save(type);
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", String.valueOf(type.getId()));
        response.put("url", "/streettype/put");
        response.put("errors", errors);
        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (streettypeDao.existsById(id)) {
            streettypeDao.deleteById(id);
        } else {
            errors = "Server Validation Errors:<br>No record found";
        }

        response.put("url", "/streettype/delete");
        response.put("errors", errors);
        return response;
    }
}
