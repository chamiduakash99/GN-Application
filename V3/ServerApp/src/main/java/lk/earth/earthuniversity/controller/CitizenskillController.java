package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.DistrictDao;
import lk.earth.earthuniversity.entity.District;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/district")
public class DistrictController {

    @Autowired
    private DistrictDao districtDao;

    // Get all districts
    @GetMapping("/list")
    public List<District> getAll() {
        return districtDao.findAll();
    }

    // Get district by ID
    @GetMapping("/{id}")
    public Optional<District> getById(@PathVariable Integer id) {
        return districtDao.findById(id);
    }

}