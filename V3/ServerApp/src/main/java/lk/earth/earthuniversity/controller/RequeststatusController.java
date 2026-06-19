package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.RequeststatusDao;
import lk.earth.earthuniversity.entity.Requeststatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/requeststatuses")
public class RequeststatusController {

    @Autowired
    private RequeststatusDao requeststatusdao;


    @GetMapping(produces = "application/json")
    public List<Requeststatus> get(){

        return requeststatusdao.findAll();

    }


    @GetMapping(path = "/list", produces = "application/json")
    public List<Requeststatus> getList(){

        List<Requeststatus> statuses =
                requeststatusdao.findAllNameId();

        statuses = statuses.stream().map(
                status -> {

                    Requeststatus rs =
                            new Requeststatus(
                                    status.getId(),
                                    status.getName()
                            );

                    return rs;

                }
        ).collect(Collectors.toList());

        return statuses;

    }

}