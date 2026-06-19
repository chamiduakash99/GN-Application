package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Brand;
import lk.earth.earthuniversity.entity.Usetype;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandDao extends JpaRepository<Brand,Integer> {
}
