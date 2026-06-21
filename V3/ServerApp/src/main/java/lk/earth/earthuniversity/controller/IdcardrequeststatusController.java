package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.IdcardrequeststatusDao;
import lk.earth.earthuniversity.entity.Idcardrequeststatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/idcardrequeststatus")
public class IdcardrequeststatusController {

    @Autowired
    private IdcardrequeststatusDao idcardrequeststatusdao;

    @GetMapping(produces = "application/json")
    public List<Idcardrequeststatus> get() {
        return idcardrequeststatusdao.findAll();
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Idcardrequeststatus> getList() {
        return idcardrequeststatusdao.findAllNameId();
    }
}