package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.IncomeDao;
import lk.earth.earthuniversity.entity.Income;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/incomes")
public class IncomeController {

    @Autowired
    private IncomeDao incomedao;

    // ── GET with optional filters ─────────────────────────────────────────────
    @GetMapping(produces = "application/json")
    public List<Income> get(@RequestParam HashMap<String, String> params) {
        List<Income> incomes = incomedao.findAll();
        if (params.isEmpty()) return incomes;

        String citizenid    = params.get("citizenid");
        String incomesource = params.get("incomesource");
        String minamount    = params.get("minamount");
        String maxamount    = params.get("maxamount");

        Stream<Income> stream = incomes.stream();

        if (citizenid != null)
            stream = stream.filter(i -> i.getCitizen().getId() == Integer.parseInt(citizenid));
        if (incomesource != null)
            stream = stream.filter(i -> i.getIncomesource() != null &&
                    i.getIncomesource().toLowerCase().contains(incomesource.toLowerCase()));
        if (minamount != null)
            stream = stream.filter(i -> i.getMonthlyaverageincome() != null &&
                    i.getMonthlyaverageincome().compareTo(new BigDecimal(minamount)) >= 0);
        if (maxamount != null)
            stream = stream.filter(i -> i.getMonthlyaverageincome() != null &&
                    i.getMonthlyaverageincome().compareTo(new BigDecimal(maxamount)) <= 0);

        return stream.collect(Collectors.toList());
    }

    // ── GET income for specific citizen ───────────────────────────────────────
    @GetMapping(path = "/citizen/{citizenId}", produces = "application/json")
    public Income getByCitizen(@PathVariable Integer citizenId) {
        Optional<Income> income = incomedao.findByCitizenId(citizenId);
        return income.orElse(null);
    }

    // ── POST ──────────────────────────────────────────────────────────────────
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Income income) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (errors.equals(""))
            incomedao.save(income);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",     String.valueOf(income.getId()));
        response.put("url",    "/incomes/" + income.getId());
        response.put("errors", errors);
        return response;
    }

    // ── PUT ───────────────────────────────────────────────────────────────────
    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> update(@RequestBody Income income) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (income.getId() == null || incomedao.findById(income.getId()).isEmpty())
            errors = "<br> Income Does Not Exist";

        if (errors.equals(""))
            incomedao.save(income);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",     String.valueOf(income.getId()));
        response.put("url",    "/incomes/" + income.getId());
        response.put("errors", errors);
        return response;
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Income income = incomedao.findById(id).orElse(null);

        if (income == null)
            errors = "<br> Income Record Does Not Exist";

        if (errors.equals(""))
            incomedao.delete(income);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",     String.valueOf(id));
        response.put("url",    "/incomes/" + id);
        response.put("errors", errors);
        return response;
    }
}