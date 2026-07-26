package lk.earth.earthuniversity.report.entity;

public class FenceReport {

    private Integer id;
    private String fencetype;
    private Long count;
    private double percentage;

    public FenceReport() { }

    public FenceReport(String fencetype, Long count) {
        this.fencetype = fencetype;
        this.count = count;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFencetype() {
        return fencetype;
    }

    public void setFencetype(String fencetype) {
        this.fencetype = fencetype;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}