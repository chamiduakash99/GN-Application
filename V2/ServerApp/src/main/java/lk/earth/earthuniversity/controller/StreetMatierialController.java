package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.StreetmatierialDao;
import lk.earth.earthuniversity.entity.Streetmatierial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/streetmatierial")
class StreetmatierialController {

    @Autowired
    private StreetmatierialDao streetmatierialDao;

    @GetMapping("/list")
    public List<Streetmatierial> getAll() {
        return streetmatierialDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Streetmatierial> getById(@PathVariable Integer id) {
        return streetmatierialDao.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> save(@RequestBody Streetmatierial matierial) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (matierial.getName() == null || matierial.getName().trim().isEmpty()) {
            errors += "Name cannot be empty.<br>";
        }

        if (errors.isEmpty()) {
            streetmatierialDao.save(matierial);
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", String.valueOf(matierial.getId()));
        response.put("url", "/streetmatierial/post");
        response.put("errors", errors);
        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Streetmatierial matierial) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Optional<Streetmatierial> ext = streetmatierialDao.findById(matierial.getId());
        if (ext.isEmpty()) {
            errors += "No record found with id " + matierial.getId();
        }

        if (errors.isEmpty()) {
            streetmatierialDao.save(matierial);
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", String.valueOf(matierial.getId()));
        response.put("url", "/streetmatierial/put");
        response.put("errors", errors);
        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (streetmatierialDao.existsById(id)) {
            streetmatierialDao.deleteById(id);
        } else {
            errors = "Server Validation Errors:<br>No record found";
        }

        response.put("url", "/streetmatierial/delete");
        response.put("errors", errors);
        return response;
    }
}
