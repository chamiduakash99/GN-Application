package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CitizenskillDao;
import lk.earth.earthuniversity.entity.Citizenskill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/citizenskills")
public class CitizenskillController {

    @Autowired
    private CitizenskillDao citizenskilldao;

    // ── GET with optional filters ─────────────────────────────────────────────
    @GetMapping(produces = "application/json")
    public List<Citizenskill> get(@RequestParam HashMap<String, String> params) {
        List<Citizenskill> skills = citizenskilldao.findAll();
        if (params.isEmpty()) return skills;

        String citizenid   = params.get("citizenid");
        String professionid = params.get("professionid");

        Stream<Citizenskill> stream = skills.stream();

        if (citizenid != null)
            stream = stream.filter(s -> s.getCitizen().getId() == Integer.parseInt(citizenid));
        if (professionid != null)
            stream = stream.filter(s -> s.getProfession().getId() == Integer.parseInt(professionid));

        return stream.collect(Collectors.toList());
    }

    // ── POST ──────────────────────────────────────────────────────────────────
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Citizenskill citizenskill) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals(""))
            citizenskilldao.save(citizenskill);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",     String.valueOf(citizenskill.getId()));
        response.put("url",    "/citizenskills/" + citizenskill.getId());
        response.put("errors", errors);
        return response;
    }

    // ── PUT ───────────────────────────────────────────────────────────────────
    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Citizenskill citizenskill) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals(""))
            citizenskilldao.save(citizenskill);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",     String.valueOf(citizenskill.getId()));
        response.put("url",    "/citizenskills/" + citizenskill.getId());
        response.put("errors", errors);
        return response;
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Citizenskill skill = citizenskilldao.findById(id).orElse(null);

        if (skill == null)
            errors = "<br> Citizen Skill Record Does Not Exist";

        if (errors.equals(""))
            citizenskilldao.delete(skill);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",     String.valueOf(id));
        response.put("url",    "/citizenskills/" + id);
        response.put("errors", errors);
        return response;
    }
}