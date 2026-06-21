package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.ComplaintstatusDao;
import lk.earth.earthuniversity.entity.Complaintstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/complaintstatuses")
public class ComplaintstatusController {

    @Autowired
    private ComplaintstatusDao complaintstatusdao;

    @GetMapping(produces = "application/json")
    public List<Complaintstatus> get() {
        return complaintstatusdao.findAll();
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Complaintstatus> getList() {
        return complaintstatusdao.findAllNameId();
    }
}