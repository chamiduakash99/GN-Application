package lk.earth.earthuniversity.report;

import lk.earth.earthuniversity.report.dao.CountByStreetMaterialDao;
import lk.earth.earthuniversity.report.entity.CountByStreetMaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/reports")
public class ReportController {

    @Autowired
    private CountByStreetMaterialDao countByStreetMaterialDao;

    @GetMapping(path = "/countbystreetmaterial", produces = "application/json")
    public List<CountByStreetMaterial> countByStreetMaterial() {

        List<CountByStreetMaterial> list = countByStreetMaterialDao.countByStreetMaterial();
        long totalCount = 0;

        for (CountByStreetMaterial record : list) {
            totalCount += record.getCount();
        }

        for (CountByStreetMaterial record : list) {
            double percentage = (double) record.getCount() / totalCount * 100;
            record.setPercentage(Math.round(percentage * 100.0) / 100.0);
        }

        return list;
    }
}
