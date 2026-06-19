package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.LandtypeDao;
import lk.earth.earthuniversity.entity.Landtype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/landtype")
public class LandtypeController {

    @Autowired
    private LandtypeDao landtypeDao;

    // Get all Land Types
    @GetMapping("/list")
    public List<Landtype> getAll() {
        return landtypeDao.findAll();
    }

    // Get Land Type by ID
    @GetMapping("/{id}")
    public Optional<Landtype> getById(@PathVariable Integer id) {
        return landtypeDao.findById(id);
    }
}
