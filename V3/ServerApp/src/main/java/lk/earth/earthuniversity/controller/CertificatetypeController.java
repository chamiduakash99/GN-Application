package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CertificatetypeDao;
import lk.earth.earthuniversity.entity.Certificatetype;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/certificatetypes")
public class CertificatetypeController {

    @Autowired
    private CertificatetypeDao certificatetypedao;


    @GetMapping(produces = "application/json")
    public List<Certificatetype> get(){

        return certificatetypedao.findAll();

    }


    @GetMapping(path = "/list", produces = "application/json")
    public List<Certificatetype> getList(){

        List<Certificatetype> certificatetypes =
                certificatetypedao.findAllNameId();

        certificatetypes = certificatetypes.stream().map(
                certificatetype -> {

                    Certificatetype ct =
                            new Certificatetype(
                                    certificatetype.getId(),
                                    certificatetype.getName()
                            );

                    return ct;

                }
        ).collect(Collectors.toList());

        return certificatetypes;

    }

}