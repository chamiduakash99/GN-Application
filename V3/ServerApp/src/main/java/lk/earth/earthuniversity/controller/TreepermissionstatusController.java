package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.TreetypeDao;
import lk.earth.earthuniversity.entity.Treetype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/treetypes")
public class TreepermissionstatusController {

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