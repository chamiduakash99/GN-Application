package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CultivationstatusDao;
import lk.earth.earthuniversity.entity.Cultivationstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/cultivationstatuses")
public class CultivationstatusController {

    @Autowired
    private CultivationstatusDao cultivationstatusdao;

    @GetMapping(produces = "application/json")
    public List<Cultivationstatus> get() {
        return cultivationstatusdao.findAll();
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Cultivationstatus> getList() {
        return cultivationstatusdao.findAllNameId();
    }
}

//package lk.earth.earthuniversity.controller;
//
//import lk.earth.earthuniversity.dao.CroptypeDao;
//import lk.earth.earthuniversity.entity.Croptype;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//
//@CrossOrigin
//@RestController
//@RequestMapping("/croptypes")
//public class CultivationstatusController {
//
//    @Autowired
//    private CroptypeDao croptypedao;
//
//    @GetMapping(produces = "application/json")
//    public List<Croptype> get() {
//        return croptypedao.findAll();
//    }
//
//    @GetMapping(path = "/list", produces = "application/json")
//    public List<Croptype> getList() {
//        return croptypedao.findAllNameId();
//    }
//}