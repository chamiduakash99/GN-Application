package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.HouseholdDao;
import lk.earth.earthuniversity.entity.Household;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/households")
public class HouseholdController {

    @Autowired
    private HouseholdDao householddao;

    @Autowired
    private lk.earth.earthuniversity.dao.CitizenDao citizendao;

    @GetMapping(produces = "application/json")
    public List<Household> get(@RequestParam HashMap<String, String> params) {
        List<Household> households = householddao.findAll();
        if (params.isEmpty()) return households;

        String householdno = params.get("householdno");
        String address     = params.get("address");

        Stream<Household> stream = households.stream();

        if (householdno != null)
            stream = stream.filter(h -> h.getHouseholdno() != null && h.getHouseholdno().toLowerCase()
                    .contains(householdno.toLowerCase()));
        if (address != null)
            stream = stream.filter(h -> h.getAddress() != null && h.getAddress().toLowerCase()
                    .contains(address.toLowerCase()));

        return stream.collect(Collectors.toList());
    }

    @GetMapping(path = "/list", produces = "application/json")
    public List<Household> getList() {
        return householddao.findAllNameId();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Household household) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        // Auto-set registration date if not provided
        if (household.getRegistrationdate() == null) {
            household.setRegistrationdate(
                    new java.sql.Date(System.currentTimeMillis()));
        }

        if (errors.equals("")) {
            householddao.save(household);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id",  String.valueOf(household.getId()));
        response.put("url", "/households/" + household.getId());
        response.put("errors", errors);
        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> update(@RequestBody Household household) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (household.getId() == null || householddao.findById(household.getId()).isEmpty())
            errors = "<br> Household Does Not Exist";

        if (errors.equals(""))
            householddao.save(household);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",  String.valueOf(household.getId()));
        response.put("url", "/households/" + household.getId());
        response.put("errors", errors);
        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Household household = householddao.findById(id).orElse(null);

        if (household == null)
            errors = "<br> Household Does Not Exist";

        // Guard: cannot delete if household still has members
        if (household != null &&
                household.getCitizensById() != null &&
                !household.getCitizensById().isEmpty()) {
            errors = "<br> Cannot delete household with active members. " +
                    "Please reassign or remove all citizens first.";
        }

        if (errors.equals(""))
            householddao.delete(household);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",  String.valueOf(id));
        response.put("url", "/households/" + id);
        response.put("errors", errors);
        return response;
    }

    // ── Membership ────────────────────────────────────────────────────────────
    // A citizen belongs to a household through citizen.household_id, so adding or
    // removing a member is an update on the CITIZEN row, not on the household.

    @PutMapping("/{id}/members/{citizenId}")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> addMember(@PathVariable Integer id,
                                             @PathVariable Integer citizenId) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Household household = householddao.findById(id).orElse(null);
        lk.earth.earthuniversity.entity.Citizen citizen = citizendao.findById(citizenId).orElse(null);

        if (household == null) errors += "<br> Household Does Not Exist";
        if (citizen == null)   errors += "<br> Citizen Does Not Exist";

        if (errors.isEmpty() && citizen.getHousehold() != null
                && !java.util.Objects.equals(citizen.getHousehold().getId(), id)) {
            errors += "<br> " + citizen.getName() + " already belongs to household "
                    + citizen.getHousehold().getHouseholdno();
        }

        if (errors.isEmpty()) {
            citizen.setHousehold(household);
            citizendao.save(citizen);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(citizenId));
        response.put("url", "/households/" + id + "/members/" + citizenId);
        response.put("errors", errors);
        return response;
    }

    @DeleteMapping("/{id}/members/{citizenId}")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> removeMember(@PathVariable Integer id,
                                                @PathVariable Integer citizenId) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Household household = householddao.findById(id).orElse(null);
        lk.earth.earthuniversity.entity.Citizen citizen = citizendao.findById(citizenId).orElse(null);

        if (household == null) errors += "<br> Household Does Not Exist";
        if (citizen == null)   errors += "<br> Citizen Does Not Exist";

        if (errors.isEmpty() && java.util.Objects.equals(household.getHeadcitizenId(), citizenId)) {
            errors += "<br> This citizen is the head of the household. Choose a different head first.";
        }

        if (errors.isEmpty()) {
            citizen.setHousehold(null);
            citizendao.save(citizen);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(citizenId));
        response.put("url", "/households/" + id + "/members/" + citizenId);
        response.put("errors", errors);
        return response;
    }

    /** citizens not yet attached to any household - the Add Member picker uses this */
    @GetMapping(path = "/unassignedcitizens", produces = "application/json")
    public List<lk.earth.earthuniversity.entity.Citizen> unassignedCitizens() {
        return citizendao.findAll().stream()
                .filter(c -> c.getHousehold() == null)
                .collect(java.util.stream.Collectors.toList());
    }
}