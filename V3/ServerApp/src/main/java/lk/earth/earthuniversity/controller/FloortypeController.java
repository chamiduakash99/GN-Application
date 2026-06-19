package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.FloortypeDao;
import lk.earth.earthuniversity.entity.Floortype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/floortype")
public class FloortypeController {

    @Autowired
    private FloortypeDao floortypeDao;

    @GetMapping("/list")
    public List<Floortype> getAll() {
        return floortypeDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Floortype> getById(@PathVariable Integer id) {
        return floortypeDao.findById(id);
    }

}