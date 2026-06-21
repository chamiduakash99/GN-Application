package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.ReasonDao;
import lk.earth.earthuniversity.entity.Reason;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/reasons")
public class ReasonController {

    @Autowired
    private ReasonDao reasondao;

    @GetMapping(produces = "application/json")
    public List<Reason> get() {
        return reasondao.findAll();
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Reason> getList() {
        return reasondao.findAllNameId();
    }
}