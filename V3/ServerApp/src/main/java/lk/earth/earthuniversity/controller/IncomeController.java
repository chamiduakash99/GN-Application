package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CitizenstatusDao;
import lk.earth.earthuniversity.entity.Citizenstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/citizenstatuses")
public class CitizenstatusController {

    @Autowired
    private CitizenstatusDao citizenstatusDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Citizenstatus> get() {

        List<Citizenstatus> citizenstatus = this.citizenstatusDao.findAll();

        List<Citizenstatus> finalCitizenstatus = citizenstatus;
        citizenstatus = citizenstatus.stream().map(
                cs -> { Citizenstatus c = new Citizenstatus();
                    c.setId(cs.getId());
                    c.setName(cs.getName());
                    return c; }
        ).collect(Collectors.toList());

        return citizenstatus;

    }

}


