package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.VoterregistryDao;
import lk.earth.earthuniversity.entity.Citizen;
import lk.earth.earthuniversity.entity.Household;
import lk.earth.earthuniversity.entity.Voterregistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/voterregistry")
public class VoterregistryController {

    @Autowired
    private VoterregistryDao voterregistrydao;

    // ── GET all entries (ordered by household then serial) ────────────────────
    @GetMapping(produces = "application/json")
    public List<Voterregistry> getAll() {
        return voterregistrydao.findAllOrdered();
    }

    // ── GET entries for a specific household ──────────────────────────────────
    @GetMapping(path = "/household/{householdId}", produces = "application/json")
    public List<Voterregistry> getByHousehold(@PathVariable Integer householdId) {
        return voterregistrydao.findByHouseholdId(householdId);
    }

    // ── GET household summary (for upper summary table) ───────────────────────
    @GetMapping(path = "/household-summary", produces = "application/json")
    public List<HashMap<String, Object>> getHouseholdSummary() {
        List<Object[]> results = voterregistrydao.getHouseholdSummary();
        List<HashMap<String, Object>> summary = new ArrayList<>();
        for (Object[] row : results) {
            HashMap<String, Object> map = new HashMap<>();
            map.put("householdId",  row[0]);
            map.put("householdno",  row[1]);
            map.put("address",      row[2]);
            map.put("votercount",   row[3]);
            summary.add(map);
        }
        return summary;
    }

    // ── GET total voter count ─────────────────────────────────────────────────
    @GetMapping(path = "/count", produces = "application/json")
    public HashMap<String, Object> getTotalCount() {
        HashMap<String, Object> response = new HashMap<>();
        response.put("totalvoters", voterregistrydao.getTotalCount());
        return response;
    }

    // ── POST generate / regenerate registry ───────────────────────────────────
    // Clears existing entries and repopulates from eligible citizens
    @PostMapping(path = "/generate")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> generate() {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        try {
            // Step 1: Clear existing registry
            voterregistrydao.clearAll();

            // Step 2: Query all eligible citizens
            List<Object[]> eligible = voterregistrydao.findEligibleCitizens();

            // Step 3: Insert each as a registry entry with serial number
            Date today = new Date(System.currentTimeMillis());
            int serial = 1;

            for (Object[] row : eligible) {
                Voterregistry entry = new Voterregistry();
                entry.setSerialno(serial++);
                entry.setRegistereddate(today);

                Citizen citizen = new Citizen();
                citizen.setId(((Number) row[0]).intValue());
                entry.setCitizen(citizen);

                Household household = new Household();
                household.setId(((Number) row[6]).intValue());
                entry.setHousehold(household);

                voterregistrydao.save(entry);
            }

            response.put("generated", String.valueOf(eligible.size()));
            response.put("errors", "");

        } catch (Exception e) {
            errors = "Error generating registry: " + e.getMessage();
            response.put("errors", errors);
            response.put("generated", "0");
        }

        return response;
    }

    // ── DELETE single entry (remove ineligible citizen manually) ──────────────
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Voterregistry entry = voterregistrydao.findById(id).orElse(null);

        if (entry == null)
            errors = "<br> Voter Registry Entry Does Not Exist";

        if (errors.equals(""))
            voterregistrydao.delete(entry);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",  String.valueOf(id));
        response.put("errors", errors);
        return response;
    }
}