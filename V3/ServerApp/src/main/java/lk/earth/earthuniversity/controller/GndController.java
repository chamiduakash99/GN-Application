package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.GndDao;
import lk.earth.earthuniversity.entity.Gnd;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/gnd")
public class GndController {

    @Autowired
    private GndDao gndDao;

    // Get all GNDs
    @GetMapping("/list")
    public List<Gnd> getAll() {
        return gndDao.findAll();
    }

    // Get GND by ID
    @GetMapping("/{id}")
    public Optional<Gnd> getById(@PathVariable Integer id) {
        return gndDao.findById(id);
    }
}
