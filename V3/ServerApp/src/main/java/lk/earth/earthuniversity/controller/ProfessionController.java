package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.ProfessionDao;
import lk.earth.earthuniversity.entity.Profession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/professions")
public class ProfessionController {

    @Autowired
    private ProfessionDao professiondao;

    @GetMapping(produces = "application/json")
    public List<Profession> get() {
        return professiondao.findAll();
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Profession> getList() {
        return professiondao.findAllNameId();
    }
}