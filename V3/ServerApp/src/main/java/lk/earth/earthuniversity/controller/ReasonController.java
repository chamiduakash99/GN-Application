package lk.earth.earthuniversity.controller;
import lk.earth.earthuniversity.dao.ReasonDao;
import lk.earth.earthuniversity.entity.Reason;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/reasons")
public class ReasonController {

    @Autowired
    private ReasonDao reasondao;

    @GetMapping(produces = "application/json")
    public List<Reason> get(){
        return reasondao.findAll();
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Reason> getList(){
        List<Reason> reasons = reasondao.findAllNameId();
        reasons = reasons.stream().map(
                reason -> {
                    Reason r = new Reason();
                    r.setId(reason.getId());
                    r.setName(reason.getName());
                    return r;
                }
        ).collect(Collectors.toList());
        return reasons;
    }
}