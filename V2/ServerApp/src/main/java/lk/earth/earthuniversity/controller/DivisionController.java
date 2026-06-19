package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.DivisionDao;
import lk.earth.earthuniversity.entity.Division;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/division")
public class DivisionController {

    @Autowired
    private DivisionDao divisionDao;

    // Get all divisions
    @GetMapping("/list")
    public List<Division> getAll() {
        return divisionDao.findAll();
    }

    // Get division by ID
    @GetMapping("/{id}")
    public Optional<Division> getById(@PathVariable Integer id) {
        return divisionDao.findById(id);
    }
}
