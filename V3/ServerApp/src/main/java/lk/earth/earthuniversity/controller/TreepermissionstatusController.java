package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.TreepermissionstatusDao;
import lk.earth.earthuniversity.entity.Treepermissionstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/treepermissionstatuses")
public class TreepermissionstatusController {

    @Autowired
    private TreepermissionstatusDao treepermissionstatusdao;

    @GetMapping(produces = "application/json")
    public List<Treepermissionstatus> get() {
        return treepermissionstatusdao.findAll();
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Treepermissionstatus> getList() {
        return treepermissionstatusdao.findAllNameId();
    }
}