package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.EthnicityDao;
import lk.earth.earthuniversity.entity.Ethnicity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/ethnicity")
public class EthnicityController {

    @Autowired
    private EthnicityDao ethnicityDao;

    @GetMapping("/list")
    public List<Ethnicity> getAll() {
        return ethnicityDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Ethnicity> getById(@PathVariable Integer id) {
        return ethnicityDao.findById(id);
    }
}