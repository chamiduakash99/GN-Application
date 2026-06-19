package lk.earth.earthuniversity.controller;


import lk.earth.earthuniversity.dao.IdcardrequeststatusDao;
import lk.earth.earthuniversity.entity.Idcardrequeststatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;



@CrossOrigin
@RestController
@RequestMapping(value = "/idcardrequeststatuses")
public class IdcardrequeststatusController {


    @Autowired
    private IdcardrequeststatusDao idcardrequeststatusdao;

    @GetMapping(produces = "application/json")
    public List<Idcardrequeststatus> get(){
        return idcardrequeststatusdao.findAll();
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Idcardrequeststatus> getList(){
        List<Idcardrequeststatus> statuses = idcardrequeststatusdao.findAllNameId();
        statuses = statuses.stream().map(
                status -> {
                    Idcardrequeststatus s = new Idcardrequeststatus();
                    s.setId(status.getId());
                    s.setName(status.getName());
                    return s;
                }
        ).collect(Collectors.toList());
        return statuses;
    }
}