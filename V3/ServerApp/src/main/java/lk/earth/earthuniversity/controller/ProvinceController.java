package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.ProvinceDao;
import lk.earth.earthuniversity.entity.Province;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/province")
public class ProvinceController {

    @Autowired
    private ProvinceDao provinceDao;

    // Get all provinces
    @GetMapping("/list")
    public List<Province> getAll() {
        return provinceDao.findAll();
    }

    // Get province by ID
    @GetMapping("/{id}")
    public Optional<Province> getById(@PathVariable Integer id) {
        return provinceDao.findById(id);
    }
}