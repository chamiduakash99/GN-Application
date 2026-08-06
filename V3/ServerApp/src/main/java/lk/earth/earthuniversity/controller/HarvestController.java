package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.HarvestDao;
import lk.earth.earthuniversity.entity.Harvest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/harvests")
public class HarvestController {

    @Autowired
    private HarvestDao harvestdao;

    @GetMapping(produces = "application/json")
    public List<Harvest> get(@RequestParam HashMap<String, String> params) {
        if (params.containsKey("cultivationid")) {
            return harvestdao.findByCultivationId(
                    Integer.parseInt(params.get("cultivationid")));
        }
        return harvestdao.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Harvest harvest) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals(""))
            harvestdao.save(harvest);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",  String.valueOf(harvest.getId()));
        response.put("url", "/harvests/" + harvest.getId());
        response.put("errors", errors);
        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> update(@RequestBody Harvest harvest) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (harvest.getId() == null || harvestdao.findById(harvest.getId()).isEmpty())
            errors = "<br> Harvest Does Not Exist";

        if (errors.equals(""))
            harvestdao.save(harvest);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",  String.valueOf(harvest.getId()));
        response.put("url", "/harvests/" + harvest.getId());
        response.put("errors", errors);
        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Harvest harvest = harvestdao.findById(id).orElse(null);

        if (harvest == null)
            errors = "<br> Harvest Record Does Not Exist";

        if (errors.equals(""))
            harvestdao.delete(harvest);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",  String.valueOf(id));
        response.put("url", "/harvests/" + id);
        response.put("errors", errors);
        return response;
    }
}