package lk.earth.earthuniversity.report.entity;

import java.math.BigDecimal;

public class CountReport {

    private Integer id;
    private String name;
    private Long count;
    private double percentage;
    private BigDecimal value;

    public CountReport() { }

    public CountReport(String name, Long count) {
        this.name = name;
        this.count = count;
    }

    public CountReport(String name, Long count, BigDecimal value) {
        this.name = name;
        this.count = count;
        this.value = value;
    }

    public CountReport(String name, Long count, Double value) {
        this.name = name;
        this.count = count;
        this.value = (value != null) ? BigDecimal.valueOf(value) : null;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getCount() { return count; }
    public void setCount(Long count) { this.count = count; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }
}