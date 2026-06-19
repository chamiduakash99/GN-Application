package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.FencetypeDao;
import lk.earth.earthuniversity.entity.Fencetype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/fencetype")
public class FencetypeController {

    @Autowired
    private FencetypeDao fencetypeDao;

    // Get all fence types
    @GetMapping("/list")
    public List<Fencetype> getAll() {
        return fencetypeDao.findAll();
    }

    // Get fence type by ID
    @GetMapping("/{id}")
    public Optional<Fencetype> getById(@PathVariable Integer id) {
        return fencetypeDao.findById(id);
    }
}
