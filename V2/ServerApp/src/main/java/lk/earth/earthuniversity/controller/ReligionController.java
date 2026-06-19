package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.ReligionDao;
import lk.earth.earthuniversity.entity.Religion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/religion")
public class ReligionController {

    @Autowired
    private ReligionDao religionDao;

    @GetMapping("/list")
    public List<Religion> getAll() {
        return religionDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Religion> getById(@PathVariable Integer id) {
        return religionDao.findById(id);
    }
}