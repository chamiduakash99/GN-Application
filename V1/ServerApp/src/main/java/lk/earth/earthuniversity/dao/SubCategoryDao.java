package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Subcategory;
import lk.earth.earthuniversity.entity.Usetype;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubCategoryDao extends JpaRepository<Subcategory,Integer> {
}
