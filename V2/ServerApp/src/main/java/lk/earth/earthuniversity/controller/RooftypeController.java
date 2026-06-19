package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.RooftypeDao;
import lk.earth.earthuniversity.entity.Rooftype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/rooftypes")
public class RooftypeController {

    @Autowired
    private RooftypeDao rooftypeDao;

    @GetMapping("/list")
    public List<Rooftype> getAll() {
        return rooftypeDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Rooftype> getById(@PathVariable Integer id) {
        return rooftypeDao.findById(id);
    }

}