package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.ComplaintstatusDao;
import lk.earth.earthuniversity.entity.Complaintstatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/complaintstatuses")
public class ComplaintstatusController {

    @Autowired
    private ComplaintstatusDao complaintstatusdao;


    @GetMapping(produces = "application/json")
    public List<Complaintstatus> get(){

        return complaintstatusdao.findAll();

    }


    @GetMapping(path = "/list", produces = "application/json")
    public List<Complaintstatus> getList(){

        List<Complaintstatus> statuses =
                complaintstatusdao.findAllNameId();

        statuses = statuses.stream().map(
                status -> {

                    Complaintstatus cs =
                            new Complaintstatus(
                                    status.getId(),
                                    status.getName()
                            );

                    return cs;

                }
        ).collect(Collectors.toList());

        return statuses;

    }

}