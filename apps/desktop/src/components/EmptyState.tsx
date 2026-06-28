import { Icon } from "./Icon";

export function EmptyState({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon name="plug" size={26} />
      </div>
      <div className="empty__title">No cluster connected</div>
      <p className="empty__sub">
        Connect any cluster from your kubeconfig — GKE, EKS (EC2 · Fargate · Auto Mode), AKS, or a
        local kind/k3s — to start managing, securing, and learning.
      </p>
      <button className="btn btn--primary" onClick={onConnect}>
        <Icon name="plug" size={16} /> Connect a cluster
      </button>
    </div>
  );
}
