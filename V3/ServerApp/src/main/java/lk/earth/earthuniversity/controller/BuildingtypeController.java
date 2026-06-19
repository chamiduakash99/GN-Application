package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.BuildingtypeDao;
import lk.earth.earthuniversity.entity.Buildingtype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/buildingtype")
public class BuildingtypeController {

    @Autowired
    private BuildingtypeDao BuildingtypeDao;

    @GetMapping("/list")
    public List<Buildingtype> getAll() {
        return BuildingtypeDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Buildingtype> getById(@PathVariable Integer id) {
        return BuildingtypeDao.findById(id);
    }

}