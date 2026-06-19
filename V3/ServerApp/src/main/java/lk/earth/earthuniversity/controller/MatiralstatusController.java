package lk.earth.earthuniversity.controller;
import lk.earth.earthuniversity.dao.MatiralstatusDao;
import lk.earth.earthuniversity.entity.Matiralstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/matiralstatus")
public class MatiralstatusController {

    @Autowired
    private MatiralstatusDao matiralstatusDao;

    // Get all Land Types
    @GetMapping("/list")
    public List<Matiralstatus> getAll() {
        return matiralstatusDao.findAll();
    }

    // Get Land Type by ID
    @GetMapping("/{id}")
    public Optional<Matiralstatus> getById(@PathVariable Integer id) {
        return matiralstatusDao.findById(id);
    }
}
