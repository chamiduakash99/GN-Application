package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CultivationDao;
import lk.earth.earthuniversity.entity.Cultivation;
import lk.earth.earthuniversity.entity.Cultivationstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/cultivations")
public class CultivationController {

    @Autowired
    private CultivationDao cultivationdao;

    // ── GET with optional filters ─────────────────────────────────────────────
    @GetMapping(produces = "application/json")
    public List<Cultivation> get(@RequestParam HashMap<String, String> params) {
        List<Cultivation> cultivations = cultivationdao.findAll();
        if (params.isEmpty()) return cultivations;

        String citizenid           = params.get("citizenid");
        String landdetailid        = params.get("landdetailid");
        String croptypeid          = params.get("croptypeid");
        String cultivationstatusid = params.get("cultivationstatusid");

        Stream<Cultivation> stream = cultivations.stream();

        if (citizenid != null)
            stream = stream.filter(c -> c.getCitizen().getId() == Integer.parseInt(citizenid));
        if (landdetailid != null)
            stream = stream.filter(c -> c.getLanddetail().getId() == Integer.parseInt(landdetailid));
        if (croptypeid != null)
            stream = stream.filter(c -> c.getCroptype().getId() == Integer.parseInt(croptypeid));
        if (cultivationstatusid != null)
            stream = stream.filter(c -> c.getCultivationstatus().getId() == Integer.parseInt(cultivationstatusid));

        return stream.collect(Collectors.toList());
    }

    // ── GET list (id + cultivationno only) ────────────────────────────────────
    @GetMapping(path = "/list", produces = "application/json")
    public List<Cultivation> getList() {
        return cultivationdao.findAllNameId();
    }

    // ── POST ──────────────────────────────────────────────────────────────────
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Cultivation cultivation) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals("")) {
            // Default status to Active (id=1) on creation
            if (cultivation.getCultivationstatus() == null) {
                Cultivationstatus active = new Cultivationstatus();
                active.setId(1);
                cultivation.setCultivationstatus(active);
            }
            cultivationdao.save(cultivation);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id",  String.valueOf(cultivation.getId()));
        response.put("url", "/cultivations/" + cultivation.getId());
        response.put("errors", errors);
        return response;
    }

    // ── PUT ───────────────────────────────────────────────────────────────────
    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> update(@RequestBody Cultivation cultivation) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (cultivation.getId() == null || cultivationdao.findById(cultivation.getId()).isEmpty())
            errors = "<br> Cultivation Does Not Exist";

        if (errors.equals(""))
            cultivationdao.save(cultivation);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",  String.valueOf(cultivation.getId()));
        response.put("url", "/cultivations/" + cultivation.getId());
        response.put("errors", errors);
        return response;
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Cultivation cultivation = cultivationdao.findById(id).orElse(null);

        if (cultivation == null) {
            errors = "<br> Cultivation Record Does Not Exist";
        } else if (cultivation.getHarvests() != null && !cultivation.getHarvests().isEmpty()) {
            errors = "<br> Cannot delete cultivation with existing harvest records. " +
                    "Please remove all harvest records first.";
        }

        if (errors.equals(""))
            cultivationdao.delete(cultivation);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",  String.valueOf(id));
        response.put("url", "/cultivations/" + id);
        response.put("errors", errors);
        return response;
    }
}