package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CategoryDao;
import lk.earth.earthuniversity.dao.UsrtypeDao;
import lk.earth.earthuniversity.entity.Category;
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
@RequestMapping(value = "/categories")
public class CategoryController {

    @Autowired
    private CategoryDao categoryDao;

    @GetMapping(produces = "application/json")
    public List<Category> get() {

        return categoryDao.findAll();

    }

}


