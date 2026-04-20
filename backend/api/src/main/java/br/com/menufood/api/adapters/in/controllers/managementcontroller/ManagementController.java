package br.com.menufood.api.adapters.in.controllers.managementcontroller;

import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import br.com.menufood.api.application.dto.order.ManagementOrderResponse;
import br.com.menufood.api.application.dto.product.CreateProductRequest;
import br.com.menufood.api.application.dto.product.UpdateProductRequest;
import br.com.menufood.api.application.dto.productoption.CreateProductOptionRequest;
import br.com.menufood.api.application.dto.productoptiongroup.CreateProductOptionGroupRequest;
import br.com.menufood.api.application.usecases.orderUseCases.GetBillingStatsUseCase;
import br.com.menufood.api.application.usecases.orderUseCases.GetOrderByIdUseCase;
import br.com.menufood.api.application.usecases.orderUseCases.ListAllOrdersUseCase;
import br.com.menufood.api.application.usecases.orderUseCases.UpdateOrderStatusUseCase;
import br.com.menufood.api.application.usecases.productOptionGroupUseCase.CreateProductOptionGroupUseCase;
import br.com.menufood.api.application.usecases.productOptionUseCase.ProductOptionUseCase;
import br.com.menufood.api.application.usecases.productUseCases.CreateProductUseCase;
import br.com.menufood.api.application.usecases.productUseCases.DeleteProductUseCase;
import br.com.menufood.api.application.usecases.productUseCases.GetProductUseCase;
import br.com.menufood.api.application.usecases.productUseCases.ListProductsUseCase;
import br.com.menufood.api.application.usecases.productUseCases.UpdateProductUseCase;
import br.com.menufood.api.application.usecases.userUseCases.UserResponseUseCase;
import br.com.menufood.api.domain.enums.Category;
import br.com.menufood.api.domain.enums.OrderStatus;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/management")
@RequiredArgsConstructor
public class ManagementController {

    private final ListAllOrdersUseCase listAllOrdersUseCase;
    private final UpdateOrderStatusUseCase updateOrderStatusUseCase;
    private final GetOrderByIdUseCase getOrderByIdUseCase;
    private final GetBillingStatsUseCase getBillingStatsUseCase;
    private final UserResponseUseCase userResponseUseCase;
    private final ListProductsUseCase listProductsUseCase;
    private final CreateProductUseCase createProductUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final GetProductUseCase getProductUseCase;
    private final DeleteProductUseCase deleteProductUseCase;
    private final CreateProductOptionGroupUseCase createProductOptionGroupUseCase;
    private final ProductOptionUseCase productOptionUseCase;

    // ── Auth ──────────────────────────────────────────────────────
    @GetMapping("/login")
    public String loginPage() {
        return "management/login";
    }

    // ── Dashboard ─────────────────────────────────────────────────
    @GetMapping({"/", "/dashboard"})
    @PreAuthorize("hasRole('ADMIN')")
    public String dashboard(Model model) {
        model.addAttribute("stats", getBillingStatsUseCase.execute());
        model.addAttribute("recentOrders", listAllOrdersUseCase.execute().stream().limit(10).toList());
        model.addAttribute("statuses", OrderStatus.values());
        return "management/dashboard";
    }

    // ── Orders ────────────────────────────────────────────────────
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public String orders(
            @RequestParam(required = false) OrderStatus status,
            Model model) {
        var orders = listAllOrdersUseCase.execute(status).stream()
                .map(order -> {
                    try {
                        var user = userResponseUseCase.execute(order.getUserId());
                        return new ManagementOrderResponse(order, user);
                    } catch (Exception e) {
                        return new ManagementOrderResponse(order, null);
                    }
                })
                .toList();
        model.addAttribute("orders", orders);
        model.addAttribute("statuses", OrderStatus.values());
        model.addAttribute("selectedStatus", status);
        return "management/orders";
    }

    @GetMapping("/orders/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String orderDetail(@PathVariable UUID id, Model model) {
        var order = getOrderByIdUseCase.execute(id);
        try {
            var user = userResponseUseCase.execute(order.getUserId());
            model.addAttribute("order", new ManagementOrderResponse(order, user));
        } catch (Exception e) {
            model.addAttribute("order", new ManagementOrderResponse(order, null));
        }
        model.addAttribute("statuses", OrderStatus.values());
        return "management/order-detail";
    }

    @GetMapping("/orders/{id}/extract")
    @PreAuthorize("hasRole('ADMIN')")
    public String orderExtract(@PathVariable UUID id, Model model) {
        var order = getOrderByIdUseCase.execute(id);
        try {
            var user = userResponseUseCase.execute(order.getUserId());
            model.addAttribute("order", new ManagementOrderResponse(order, user));
        } catch (Exception e) {
            model.addAttribute("order", new ManagementOrderResponse(order, null));
        }
        return "extracts/extract";
    }

    @PostMapping("/orders/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public String updateStatus(
            @PathVariable UUID id,
            @RequestParam OrderStatus status,
            RedirectAttributes redirectAttributes) {
        updateOrderStatusUseCase.execute(id, status);
        redirectAttributes.addFlashAttribute("successMessage", "Status do pedido atualizado com sucesso.");
        return "redirect:/management/orders";
    }

    // ── Billing ───────────────────────────────────────────────────
    @GetMapping("/billing")
    @PreAuthorize("hasRole('ADMIN')")
    public String billing(Model model) {
        model.addAttribute("stats", getBillingStatsUseCase.execute());
        model.addAttribute("statuses", OrderStatus.values());
        return "management/billing";
    }

    // ── Products ──────────────────────────────────────────────────
    @GetMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public String products(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) Boolean active,
            Model model) {
        model.addAttribute("products", listProductsUseCase.executeAdmin(search, category, active));
        model.addAttribute("categories", Category.values());
        model.addAttribute("search", search);
        model.addAttribute("selectedCategory", category);
        model.addAttribute("selectedActive", active);
        return "management/products";
    }

    @GetMapping("/products/new")
    @PreAuthorize("hasRole('ADMIN')")
    public String newProductForm(Model model) {
        model.addAttribute("categories", Category.values());
        return "management/product-new";
    }

    @PostMapping("/products/new")
    @PreAuthorize("hasRole('ADMIN')")
    public String createProduct(
            @ModelAttribute CreateProductRequest request,
            RedirectAttributes ra) {
        var product = createProductUseCase.execute(request);
        ra.addFlashAttribute("successMessage",
                "Produto \"" + product.getName() + "\" criado com sucesso! Agora você pode adicionar grupos de opções.");
        return "redirect:/management/products/" + product.getId() + "/edit";
    }

    @GetMapping("/products/{id}/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public String editProductForm(@PathVariable UUID id, Model model) {
        model.addAttribute("product", getProductUseCase.execute(id));
        model.addAttribute("categories", Category.values());
        return "management/product-edit";
    }

    @PostMapping("/products/{id}/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public String updateProduct(
            @PathVariable UUID id,
            @ModelAttribute UpdateProductRequest request,
            RedirectAttributes ra) {
        updateProductUseCase.execute(id, request);
        ra.addFlashAttribute("successMessage", "Produto atualizado com sucesso!");
        return "redirect:/management/products/" + id + "/edit";
    }

    @PostMapping("/products/{id}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteProduct(@PathVariable UUID id, RedirectAttributes ra) {
        deleteProductUseCase.execute(id);
        ra.addFlashAttribute("successMessage", "Produto excluído com sucesso.");
        return "redirect:/management/products";
    }

    @PostMapping("/products/{id}/groups")
    @PreAuthorize("hasRole('ADMIN')")
    public String createOptionGroup(
            @PathVariable UUID id,
            @ModelAttribute CreateProductOptionGroupRequest request,
            RedirectAttributes ra) {
        request.setProductId(id);
        createProductOptionGroupUseCase.execute(request);
        ra.addFlashAttribute("successMessage", "Grupo de opções criado com sucesso!");
        return "redirect:/management/products/" + id + "/edit";
    }

    @PostMapping("/products/{id}/groups/{groupId}/options")
    @PreAuthorize("hasRole('ADMIN')")
    public String createOption(
            @PathVariable UUID id,
            @PathVariable UUID groupId,
            @ModelAttribute CreateProductOptionRequest request,
            RedirectAttributes ra) {
        request.setGroupId(groupId);
        productOptionUseCase.execute(request);
        ra.addFlashAttribute("successMessage", "Opção adicionada com sucesso!");
        return "redirect:/management/products/" + id + "/edit";
    }

    @PostMapping("/products/{id}/groups/{groupId}/options/{optionId}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteOption(
            @PathVariable UUID id,
            @PathVariable UUID groupId,
            @PathVariable UUID optionId,
            RedirectAttributes ra) {
        productOptionUseCase.deleteOption(optionId);
        ra.addFlashAttribute("successMessage", "Opção excluída com sucesso!");
        return "redirect:/management/products/" + id + "/edit";
    }

    @PostMapping("/products/{id}/groups/{groupId}/options/{optionId}/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public String editOption(
            @PathVariable UUID id,
            @PathVariable UUID groupId,
            @PathVariable UUID optionId,
            @RequestParam String name,
            @RequestParam(required = false) java.math.BigDecimal price,
            RedirectAttributes ra) {
        productOptionUseCase.updateOption(optionId, name, price);
        ra.addFlashAttribute("successMessage", "Opção atualizada com sucesso!");
        return "redirect:/management/products/" + id + "/edit";
    }

    

}