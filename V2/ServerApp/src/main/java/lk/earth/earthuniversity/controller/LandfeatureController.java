package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.LandfeatureDao;
import lk.earth.earthuniversity.entity.Landfeature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/landfeature")
public class LandfeatureController {

    @Autowired
    private LandfeatureDao landfeatureDao;

    // Get all Land Features
    @GetMapping("/list")
    public List<Landfeature> getAll() {
        return landfeatureDao.findAll();
    }

    // Get Land Feature by ID
    @GetMapping("/{id}")
    public Optional<Landfeature> getById(@PathVariable Integer id) {
        return landfeatureDao.findById(id);
    }
}
