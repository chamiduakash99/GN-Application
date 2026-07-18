package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.TreetypeDao;
import lk.earth.earthuniversity.entity.Treetype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/treetypes")
public class TreetypeController {

    @Autowired
    private TreetypeDao treetypedao;

    @GetMapping(produces = "application/json")
    public List<Treetype> get() {
        return treetypedao.findAll();
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Treetype> getList() {
        return treetypedao.findAllNameId();
    }
}