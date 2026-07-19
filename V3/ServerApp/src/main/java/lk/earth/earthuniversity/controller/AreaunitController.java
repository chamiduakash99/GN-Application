package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.AreaunitDao;
import lk.earth.earthuniversity.entity.Areaunit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/areaunits")
public class AreaunitController {

    @Autowired
    private AreaunitDao areunitdao;

    @GetMapping(produces = "application/json")
    public List<Areaunit> get() {
        return areunitdao.findAll();
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Areaunit> getList() {
        return areunitdao.findAllNameId();
    }
}