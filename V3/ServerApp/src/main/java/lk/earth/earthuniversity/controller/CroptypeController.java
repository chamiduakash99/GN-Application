package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CroptypeDao;
import lk.earth.earthuniversity.entity.Croptype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/croptypes")
public class CroptypeController {

    @Autowired
    private CroptypeDao croptypedao;

    @GetMapping(produces = "application/json")
    public List<Croptype> get() {
        return croptypedao.findAll();
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Croptype> getList() {
        return croptypedao.findAllNameId();
    }
}