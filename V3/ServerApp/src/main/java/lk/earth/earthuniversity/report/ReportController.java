package lk.earth.earthuniversity.report;

import lk.earth.earthuniversity.report.dao.CountByStreetMaterialDao;
import lk.earth.earthuniversity.report.dao.FenceReportDao;
import lk.earth.earthuniversity.report.dao.LandReportDao;
import lk.earth.earthuniversity.report.entity.CountByStreetMaterial;
import lk.earth.earthuniversity.report.entity.FenceReport;
import lk.earth.earthuniversity.report.entity.LandReport;
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

    @Autowired
    private LandReportDao countBylandtype;
    @GetMapping(path = "/landreport", produces = "application/json")
    public List<LandReport> countByLandTypes() {

        List<LandReport> list = countBylandtype.countByLandType();
        long totalCount = 0;

        for (LandReport record : list) {
            totalCount += record.getCount();
        }

        for (LandReport record : list) {
            double percentage = (double) record.getCount() / totalCount * 100;
            record.setPercentage(Math.round(percentage * 100.0) / 100.0);
        }

        return list;
    }

    @Autowired
    private FenceReportDao countByfencetype;

    @GetMapping(path = "/fencereport", produces = "application/json")
    public List<FenceReport> countByFenceTypes() {

        List<FenceReport> list = countByfencetype.countByFenceType();
        long totalCount = 0;

        for (FenceReport record : list) {
            totalCount += record.getCount();
        }

        for (FenceReport record : list) {
            double percentage = (double) record.getCount() / totalCount * 100;
            record.setPercentage(Math.round(percentage * 100.0) / 100.0);
        }

        return list;
    }
}
