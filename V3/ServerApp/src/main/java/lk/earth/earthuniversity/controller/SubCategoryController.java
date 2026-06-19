package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.SubCategoryDao;
import lk.earth.earthuniversity.dao.UsrtypeDao;
import lk.earth.earthuniversity.entity.Subcategory;
import lk.earth.earthuniversity.entity.Usetype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/subcategories")
public class SubCategoryController {

    @Autowired
    private SubCategoryDao subCategoryDao;

    @GetMapping(produces = "application/json")
    public List<Subcategory> get() {

        return subCategoryDao.findAll();

    }

}


