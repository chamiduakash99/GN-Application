package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.BrandDao;
import lk.earth.earthuniversity.entity.Brand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/brands")
public class ProfessionController {

    @Autowired
    private BrandDao brandDao;

    @GetMapping(produces = "application/json")
    public List<Brand> get() {

        return brandDao.findAll();

    }

}


