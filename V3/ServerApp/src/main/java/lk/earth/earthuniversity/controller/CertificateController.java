package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CertificateDao;
import lk.earth.earthuniversity.entity.Certificate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/certificates")
public class CertificateController {

    @Autowired
    private CertificateDao certificatedao;


    @GetMapping(produces = "application/json")
    public List<Certificate> get(@RequestParam HashMap<String,String> params){

        List<Certificate> certificates = certificatedao.findAll();

        if(params.isEmpty()) return certificates;

        String cetificateno = params.get("cetificateno");

        Stream<Certificate> cstream = certificates.stream();

        if(cetificateno != null)
            cstream = cstream.filter(c ->
                    c.getCetificateno().contains(cetificateno));

        return cstream.collect(Collectors.toList());

    }


    @GetMapping(path = "/list", produces = "application/json")
    public List<Certificate> getList(){

        List<Certificate> certificates = certificatedao.findAllNameId();

        certificates = certificates.stream().map(
                certificate -> {
                    Certificate c = new Certificate(
                            certificate.getId(),
                            certificate.getCetificateno()
                    );
                    return c;
                }
        ).collect(Collectors.toList());

        return certificates;

    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Certificate certificate){

        HashMap<String,String> response = new HashMap<>();

        String errors = "";

        if(certificatedao.findByCetificateno(
                certificate.getCetificateno()) != null)

            errors = errors + "<br> Existing Certificate Number";


        if(errors.equals(""))
            certificatedao.save(certificate);
        else
            errors = "Server Validation Errors : <br> " + errors;


        response.put("id", String.valueOf(certificate.getId()));
        response.put("url", "/certificates/" + certificate.getId());
        response.put("errors", errors);

        return response;

    }


    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(@RequestBody Certificate certificate){

        HashMap<String,String> response = new HashMap<>();

        String errors = "";

        Certificate c1 = certificatedao.findByCetificateno(
                certificate.getCetificateno());

        if(c1 != null && certificate.getId() != c1.getId())
            errors = errors + "<br> Existing Certificate Number";


        if(errors.equals(""))
            certificatedao.save(certificate);
        else
            errors = "Server Validation Errors : <br> " + errors;


        response.put("id", String.valueOf(certificate.getId()));
        response.put("url", "/certificates/" + certificate.getId());
        response.put("errors", errors);

        return response;

    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        HashMap<String,String> response = new HashMap<>();

        String errors = "";

        Certificate certificate = certificatedao.findByMyId(id);

        if(certificate == null)
            errors = errors + "<br> Certificate Does Not Exist";


        if(errors.equals(""))
            certificatedao.delete(certificate);
        else
            errors = "Server Validation Errors : <br> " + errors;


        response.put("id", String.valueOf(id));
        response.put("url", "/certificates/" + id);
        response.put("errors", errors);

        return response;

    }

}